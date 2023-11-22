import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker as fakerjs } from '@faker-js/faker';

export enum Role {
  User = 'user',
  Admin = 'admin',
}
const prisma = new PrismaClient();
async function main() {
  const userIds = await createUsers();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const postIds = await createPosts(userIds);
}
async function createUsers() {
  const userIds = [];
  const password = await bcrypt.hash('password', 10);
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      firstName: 'Alice',
      lastName: 'test',
      password,
    },
  });
  userIds.push(alice.id);
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      firstName: 'Bob',
      lastName: 'bla bla',
      middleName: 'asdsdsd',
      password,
    },
  });
  userIds.push(bob.id);
  for (let i = 0; i < 50; i++) {
    const newUser = await prisma.user.create({
      data: {
        email: fakerjs.internet.email(),
        firstName: fakerjs.person.firstName(),
        lastName: fakerjs.person.lastName(),
        middleName: fakerjs.person.middleName(),
        role: fakerjs.helpers.arrayElement(Object.values(Role)),
        password,
      },
    });
    userIds.push(newUser.id);
  }
  return userIds;
}
async function createPosts(userIds: number[]) {
  const postIds = [];
  for (let i = 0; i < 1500; i++) {
    const newUser = await prisma.post.create({
      data: {
        title: fakerjs.lorem.words({ min: 3, max: 5 }),
        content: fakerjs.lorem.words({ min: 5, max: 15 }),
        authorId: fakerjs.helpers.arrayElement(userIds),
        published: fakerjs.datatype.boolean(),
      },
    });
    postIds.push(newUser.id);
  }
  return postIds;
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
