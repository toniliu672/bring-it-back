import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin_password', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })