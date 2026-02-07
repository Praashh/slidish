import { prisma } from '@/db';
import bcrypt from 'bcryptjs';


async function main() {
    const email = 'praash@gmail.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
        },
        create: {
            email,
            name: 'Praash',
            password: hashedPassword,
        },
    });

    console.log('User created/updated:', user.email);
    console.log('Password is:', password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
