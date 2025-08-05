import { gameProps } from "@/utils/types/game";
import { Container } from "@/components/container";
import { Input } from "@/components/input";
import { GameCard } from "@/components/gameCard";



async function getData(title: string) {
    try {
        const decodeTitle = decodeURI(title)
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&title=${decodeTitle}`)
        return res.json();
    } catch (err) {
        return null
    }
}

export default async function Search({
    params: { title }
}: {
    params: { title: string }
}) {
    const games: gameProps[] = await getData(title)
    return (
        <main className="w-full text-black">
            <Container>
                <Input />
                <h1 className="font-bold text-xl mt-8 mb-5">Resultados encontrados: </h1>
                {!games && (
                    <p>Jogo não encontrado!</p>
                )}
                <section>
                    <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {games && games.map((item) => (
                            <GameCard key={item.id} data={item} />
                        ))}
                    </section>
                </section>
            </Container>
        </main>
    )
}