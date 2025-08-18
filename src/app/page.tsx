import { Container } from "@/components/container";
import Image from "next/image";
import { gameProps } from '@/utils/types/game'
import Link from "next/link";
import { BsArrowRightSquare } from 'react-icons/bs'
import { Input } from "@/components/input/index"
import { GameCard } from "@/components/gameCard";

async function getDalyGame(): Promise<gameProps | null> {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, { next: { revalidate: 320 } });

    if (!res.ok) {
      console.error('API responded with a non-200 status for getDalyGame:', res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error('Failed to fetch data for daily game:', err);
    return null;
  }
}

async function getGamesData(): Promise<gameProps[]> {
  try {
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=games`, { next: { revalidate: 320 } });

    if (!res.ok) {
      console.error('API responded with a non-200 status for getGamesData:', res.status);
      return []; // Retorna um array vazio para evitar erros
    }

    return res.json();
  } catch (err) {
    console.error('Failed to fetch data for games:', err);
    return []; // Retorna um array vazio para evitar erros
  }
}

export default async function Home() {
  const dalyGame = await getDalyGame();
  const data = await getGamesData();

  return (
    <main className="w-full">
      <Container>
        <h1 className="text-center font-bold text-xl mt-8 mb-5">Separamos um jogo exclusivo para você</h1>

        {/* Renderiza o jogo diário APENAS se ele existir */}
        {dalyGame ? (
          <Link href={`/game/${dalyGame.id}`}>
            <section className="w-full bg-black rounded-lg">
              <div className="w-full max-h-96 h-96 relative rounded-lg">
                <div className="absolute font-bold text-xl text-white z-20 bottom-0 p-3 flex justify-center items-center gap-2">
                  <p>{dalyGame.title}</p>
                  <BsArrowRightSquare size={24} color="#fff" />
                </div>
                <Image 
                  src={dalyGame.image_url} 
                  alt={dalyGame.title} 
                  priority 
                  quality={100} 
                  fill={true}
                  className="object-cover rounded-lg opacity-50 hover:opacity-100 transition-all duration-300" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw" 
                />
              </div>
            </section>
          </Link>
        ) : (
          <p className="text-center font-semibold text-lg">Não foi possível carregar o jogo diário.</p>
        )}

        <Input />

        <h2>Jogos para conhecer</h2>

        {/* Renderiza a lista de jogos APENAS se houver dados */}
        {data.length > 0 ? (
          <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((item) => (
              <GameCard key={item.id} data={item} />
            ))}
          </section>
        ) : (
          <p className="text-center font-semibold text-lg">Não foi possível carregar a lista de jogos.</p>
        )}
      </Container>
    </main>
  );
}
