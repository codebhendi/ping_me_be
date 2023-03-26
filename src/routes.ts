import { UserData } from 'entity/UserData';
import { UserStatus } from 'entity/UserStatus';
import express from 'express';
import { getManager, createQueryBuilder } from 'typeorm';
import {
  findUserViaEmail,
  sendLoginEmail,
  generateOtp,
  createSignedToken,
  verifyUserOtp,
} from './utils';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('Hello world');
});

router.get('/user-list', async (_, res) => {
  try {
    const data = await getManager().getRepository(UserData).find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/user-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getManager().getRepository(UserData).findOne(id);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

router.get('/check-is-user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getManager()
      .getRepository(UserData)
      .findOne({ id }, { select: ['id'] });
    return res.status(200).json(!!data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/update-user/:id', async (req, res) => {
  const { id } = req.params;
  const { company_name, public_email, contact_number, admin_user_id } = req.body;

  const payload = Object.keys({
    company_name,
    public_email,
    contact_number,
    admin_user_id,
  }).reduce<{
    [key: string]: object;
  }>((acc, v) => {
    if (req.body[v] !== null && typeof req.body[v] !== 'undefined') {
      acc[v] = req.body[v];
    }
    return acc;
  }, {});

  try {
    const {
      raw: [userData],
    }: { raw: UserData[] } = await createQueryBuilder()
      .update(UserData)
      .set(payload)
      .where({ id })
      .returning(['id'])
      .execute();

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/update-user-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const {
      raw: [userStatusData],
    }: { raw: UserStatus[] } = await createQueryBuilder()
      .insert()
      .into(UserStatus)
      .values({ current_status: status, user_id: id })
      .orUpdate(['current_status'], ['user_id'])
      .returning(['id'])
      .execute();

    return res.status(200).json(userStatusData);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(500).json({
      message: 'Invalid email',
    });
  }

  try {
    const user = await findUserViaEmail(email);

    const otp = await generateOtp(user.id);

    if (!otp) return res.status(500).json({ code: 'OTP_EXISTS' });

    sendLoginEmail(email, otp);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

router.post('/verify-auth-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(500).json({
      message: 'Invalid email : OTP',
    });
  }

  try {
    const userId = await verifyUserOtp(email, otp);
    const token = createSignedToken(userId, email);
    return res.status(200).json({ token });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
});

export default router;
