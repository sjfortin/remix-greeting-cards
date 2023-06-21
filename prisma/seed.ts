import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getCards().map((card) => {
      const data = { cardCreatorId: kody.id, ...card };
      return db.card.create({ data });
    })
  );
}

seed();

function getCards() {
  return [
    {
      cardRecipient: "John Doe",
      frontContent: "Happy Birthday!",
      insideContent:
        "Wishing you all the happiness your holiday can hold! May your birthday be filled with laughter and love.",
    },
    {
      cardRecipient: "Jane Smith",
      frontContent: "Merry Christmas",
      insideContent:
        "May your Christmas be decorated with cheer and filled with love. Have a wonderful holiday!",
    },
    {
      cardRecipient: "Bob Johnson",
      frontContent: "Happy Anniversary",
      insideContent:
        "May your a celebration of love turn out as beautiful as the both of you. Happy Anniversary!",
    },
    {
      cardRecipient: "Alice Davis",
      frontContent: "Congratulations on your Graduation",
      insideContent:
        "You worked so hard and successfully completed your studies. Now the real work begins with your new teacher - Life! All the best and good luck for the future.",
    },
  ];
}
