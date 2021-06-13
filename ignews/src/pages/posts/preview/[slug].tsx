/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/client'
import { RichText } from 'prismic-dom'
import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import router from 'next/router'
import { getPrismicClient } from '../../../services/prismic'
import styles from '../post.module.scss'

type Post = {
  slug: string
  title: string
  content: string
  updatedAt: string
}

interface IPostPreviewProps {
  post: Post
}

export default function PostPreview({ post }: IPostPreviewProps): JSX.Element {
  const [session] = useSession()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [post.slug, session?.activeSubscription])

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking'
  // true => Se não gerado carrega o conteudo no browser
  // false => Se não gerado retorna 404
  // blocking => Carrega o conteudo e gera o html para acesso futuro
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('post', String(slug), {})
  const post = {
    slug,
    title: RichText.asText(response?.data?.title),
    content: RichText.asHtml(response?.data?.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  return {
    props: { post },
    revalidate: 60 * 60 * 24 // 24h
  }
}
