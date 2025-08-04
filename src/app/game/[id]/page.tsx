import { gameProps } from "@/utils/types/game"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Container } from "@/components/container"

async function getData(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`)
        return res.json()
    } catch (err) {
        throw new Error('Failed to fetch data')
    }
}

export default async function Game({
    params: { id }
}: {
    params: { id: string }
}) {
    const data: gameProps = await getData(id)
    if (!data) {
        redirect("/")
    }
    return (
        <main className="w-full text-black">
            <div className="bg-black h-80 sm:h-96 w-full relative">
                <Image src={data.image_url} alt={data.title} className="object-cover w-full h-80 sm:h-96 opacity-80" quality={100} priority={true} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw"/>
            </div>
            <Container>
                <h1 className="font-bold text-xl my-4">{data.title}</h1>
                <p>{data.description}</p>
            </Container>
        </main>
    )
}