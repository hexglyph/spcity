import React from "react"
import Head from "next/head";
import { useState } from "react";
import prisma from '../lib/prisma';
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import { Navbar } from "../components/Navbar";
import GoogleMapApp from "../components/Map";
import User from "../components/User";


export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } }
}

type Props = {
  feed: PostProps[]
}

const Home: React.FC<Props> = (props) => {
  return (
    <Layout>
      <Head>
        <title>SPCity</title>
      </Head>
      
      
      <div className="relative page overflow-hidden">
        <User />
        <Navbar title={"SPCity"} icon={""}/>
        <main className={`flex w-full h-auto`}>
          
          <div className={`relative flex flex-col w-screen h-screen`}>
            <GoogleMapApp />
          </div>
          <div className="fixed top-0 bottom-0 right-0 h-screen w-[300px] flex z-30">
            {props.feed.map((post) => (
              <div key={post.id} className={`post`}>
                <Post post={post} />
              </div>
            ))}
          </div>
          
        </main>
      </div>
    </Layout>
  )
}

export default Home
