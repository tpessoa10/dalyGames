import { gameProps } from "@/utils/types/game"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Container } from "@/components/container"
import { Label } from "./components/label"
import { GameCard } from "@/components/gameCard"
import { Metadata } from "next"
import { use } from "react"
import { Params } from "next/dist/server/request/params"


interface GamePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: GamePageProps) {
    const params = await props.params;
    try {
        const { id } = params; // Desestruture 'id' diretamente de 'params'
        const response: gameProps = await fetch(
            `${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`,
            { next: { revalidate: 120 } }
        )
            .then((res) => res.json())
            .catch(() => ({
                title: "Daly Games - Descubra jogos",
            }));

        return {
            title: response.title,
            description: `${response.description.slice(0, 100)}...`,
            openGraph: {
                title: response.title,
                images: [response.image_url],
            },
            robots: {
                index: true,
                follow: true,
                nocache: true,
                googleBot: {
                    index: true,
                    follow: true,
                    noimageindex: true,
                },
            },
        };
    } catch {
        return { title: "Daly Games - Descubra jogos" };
    }
}

async function getData(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`,
            { next: { revalidate: 120 } }
        );
        return res.json();
    } catch {
        throw new Error("Failed to fetch data");
    }
}

async function getGameSorted() {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, {
            cache: "no-store",
        });
        return res.json();
    } catch {
        throw new Error("Failed to fetch");
    }
}
export default async function Game(props:GamePageProps) {
    const params = await props.params;
    const { id } = params; // Desestruture 'id' diretamente de 'params'

    const data: gameProps = await getData(id);
    const sortedGame: gameProps = await getGameSorted();

    if (!data) {
        redirect("/");
    }

    return (
        <main className="w-full text-black">
            <div className="bg-black h-80 sm:h-96 w-full relative">
                <Image
                    src={data.image_url}
                    alt={data.title}
                    className="object-cover w-full h-80 sm:h-96 opacity-80"
                    quality={100}
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw"
                />
            </div>
            <Container>
                <h1 className="font-bold text-xl my-4">{data.title}</h1>
                <p>{data.description}</p>
                <h2 className="font-bold text-lg mt-7 mb-2">Plataformas</h2>
                <div className="flex gap-2 flex-wrap">
                    {data.platforms.map((item) => (
                        <Label name={item} key={item} />
                    ))}
                </div>
                <h2 className="font-bold text-lg mt-7 mb-2">Categorias</h2>
                <div className="flex gap-2 flex-wrap">
                    {data.categories.map((item) => (
                        <Label name={item} key={item} />
                    ))}
                </div>
                <p className="mt-7 mb-2">
                    <strong>Data de lançamento: </strong>
                    {data.release}
                </p>
                <h2 className="font-bold text-lg mt-7 mb-2">Jogo recomendado:</h2>
                <div className="flex-grow">
                    <GameCard data={sortedGame} />
                </div>
            </Container>
        </main>
    );
}