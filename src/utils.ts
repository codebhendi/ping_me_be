import { createQueryBuilder, getConnection, getRepository } from 'typeorm';
import Mailjet from 'node-mailjet';
import { totp } from 'otplib';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { UserData } from 'entity/UserData';
import { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, TOTP_SECRET, TOKEN_SECRET } from './constants';
import { UserAuth } from 'entity/UserAuth';

const mailjet = new Mailjet({ apiKey: MJ_APIKEY_PUBLIC, apiSecret: MJ_APIKEY_PRIVATE });

export const decodeToken = (token: string) => jwt.verify(token, TOKEN_SECRET);

export async function generateUserViaEmail(email: string) {
  try {
    const {
      raw: [userData],
    }: { raw: UserData[] } = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserData)
      .values({
        email,
      })
      .execute();
    return userData;
  } catch (err) {
    console.error(err);
    throw Error('Unable to create user');
  }
}

export async function findUserViaEmail(email: string) {
  try {
    const data = await getRepository(UserData).findOne({
      where: { email },
    });

    if (!data) {
      return await generateUserViaEmail(email);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export async function sendLoginEmail(email: string, otp: string) {
  const request = mailjet.post('send').request({
    FromEmail: 'bhendarkar.shubham@gmail.com',
    FromName: "Shubham's site",
    Subject: 'Login OTP',
    'Html-part': `
          <h3>Hi,</h3>
          Login to your account using the following code <br />
          <b>${otp}</b><br />
          Thanks.
        `,
    Recipients: [{ Email: email }],
  });

  request
    .then(result => {
      // eslint-disable-next-line no-console
      console.log(result.body);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err.statusCode);
      throw err;
    });
}

export async function generateOtp(id: string) {
  try {
    const data = await getRepository(UserAuth).findOne({
      where: { user_id: id },
    });

    if (!data) {
      const {
        raw: [authData],
      } = await createQueryBuilder()
        .insert()
        .into(UserAuth)
        .values({
          otp_value: totp.generate(TOTP_SECRET),
          user_id: id,
        })
        .returning(['id', 'otp_value'])
        .execute();

      return authData.otp_value;
    } else {
      if (new Date().getTime() - new Date(data.updated_at).getTime() > 300000) {
        const {
          raw: [authData],
        } = await createQueryBuilder()
          .update(UserAuth)
          .set({
            otp_value: totp.generate(TOTP_SECRET),
            updated_at: new Date(),
          })
          .where({ id: data.id })
          .returning(['id', 'otp_value'])
          .execute();

        return authData.otp_value;
      }
    }
  } catch (err) {
    throw err;
  }
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  // checking the headers for authorization headers
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      code: 'INVALID_TOKEN',
    });
  }

  // decode the token
  const header = req.headers.authorization.split(' ');
  const token = header[1];

  try {
    const data = decodeToken(token) as UserAuth;

    // if (!data.id) {
    //   return res.status(400).json({ code: 'INVALID_TOKEN' });
    // }

    req.body = { id: data.id };

    return next();
  } catch (e) {
    throw e;
  }
}

export async function verifyUserOtp(email: string, otp: string) {
  try {
    const data = await createQueryBuilder(UserAuth, 'u')
      .innerJoinAndSelect('u.user_id', 'user_data')
      .where('user_data.email = :email', { email })
      .getOne();

    if (!data) {
      throw Error('No OTP found');
    }

    if (data.otp_value !== otp || new Date().getTime() - data.updated_at.getTime() > 600000) {
      throw Error('Invalid OTP');
    }

    await createQueryBuilder().delete().from(UserAuth).where({ id: data.id }).execute();

    return data.user_id;
  } catch (err) {
    throw err;
  }
}

export const createSignedToken = (id: string, email: string) =>
  jwt.sign({ id, email }, TOKEN_SECRET, { expiresIn: '7d' });
