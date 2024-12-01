import s from './App.module.scss';
import {useState} from "react";
import {Button} from "@mantine/core";

export type Props = {
    products: Product[],
}

type Product = {
    id: number
    title: string
    description: string,
    price: number,
    category: string,
    thumbnail: string,
    images: string[]
}

export function App(props: Props) {
    const [products] = useState<Product[]>(props.products);

    if (products.length === 0) {
        return <h1>Nothing to see here</h1>
    }

    return <div className={`${s.PostsContainer}`}>
        {products.map(p =>
            <div className={s.Post} key={p.id}>
                <p>{p.title}</p>
                <img src={p.thumbnail} alt={p.title} />
                <Button>Buy!</Button>
            </div>
        )}
    </div>;
}