export type Product = {
    id: string,
    title: string,
    description: string
    price: number,

    count: number,
}

export type CreateProduct = {
    description: string,
    count: number,
    title: string,
    price: number,
}