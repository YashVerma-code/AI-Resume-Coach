import { prisma } from "./src/lib/prisma.js"


async function main() {
  // Create a new user with a post
  const user = await prisma.resume.create({
    data: {
      userId: '1',
      fileName:"text.pdf",
      rawText:"erxdtcfvygbuh  rxdtcfvgb rcvh uf"
    }
  })
  console.log('Created resume:', user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })