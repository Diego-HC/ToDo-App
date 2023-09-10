import Head from "next/head";

type HeadProps = {
  title: string;
  description: string;
};

export default function HeadComponent({ title, description }: HeadProps) {
  return <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.ico" />
  </Head>;
}
