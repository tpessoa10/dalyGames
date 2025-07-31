import { Container } from "@/components/container";
import Image from "next/image";
import { gameProps } from '@/utils/types/game'
import Link from "next/link";

async function getDalyGame() {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`)
    return res.json()
  } catch (err) {
    throw new Error("Failed to fetch data")
  }
}

export default async function Home() {
  const dalyGame: gameProps = await getDalyGame();

  return (
    <main className="flex w-full">
      <Container>
        <h1 className="text-center font-bold text-xl mt-8">Separamos um jogo exclusivo para você</h1>
        <Link href={`/game/${dalyGame.id}`}>
          <section className="w-full bg-black rounded-lg">
            <Image src={dalyGame.image_url} alt={dalyGame.title} priority quality={100} width={100} height={100}/>
          </section>
        </Link>
      </Container>
    </main>
  );
}
