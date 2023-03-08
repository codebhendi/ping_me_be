import { User } from 'entity/User';
import express from 'express';
import { getManager, getConnection, createQueryBuilder } from 'typeorm';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('Hello world');
});

router.get('/user-list', async (_, res) => {
  try {
    const data = await getManager().query('SELECT id from  client');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/user-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = (await getManager().getRepository(User).findOne(id)) as User;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/check-is-user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getManager()
      .getRepository(User)
      .findOne({ id }, { select: ['id'] });
    return res.status(200).json(!!data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/generate-user', async (req, res) => {
  const { username, email, name } = req.body;

  try {
    const {
      raw: [userData],
    }: { raw: User[] } = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        name,
      })
      .execute();

    return res.status(200).json(userData);
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
    }: { raw: User[] } = await createQueryBuilder()
      .update(User)
      .set(payload)
      .where({ id })
      .returning(['id'])
      .execute();

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
