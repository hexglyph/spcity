import React from "react"
import Head from "next/head";
import { useState } from "react";
import prisma from '../lib/prisma';
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import { Navbar } from "../components/Navbar";
import GoogleMapApp from "../components/Map";
import { What3wordsAutosuggest, What3wordsMap } from "@what3words/react-components";
import WhatForm from "../components/WhatForm";
import { Wrapper } from "@googlemaps/react-wrapper";


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
        <title>Home</title>
        {/*<script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY_MAPS}`}
            async
  ></script>*/}
      </Head>
      <Navbar title={""} icon={""}/>
      <div className="page">
        <h1>SPCity</h1>
        <main className={`flex w-full h-auto`}>
          
          <div className={`relative flex flex-col w-full min-h-[600px] md:w-3/5`}>
            <div id="map" className="flex flex-col w-full h-full grow">
              <Wrapper apiKey={`${process.env.NEXT_PUBLIC_API_KEY_MAPS}`} render={render}>
                <GoogleMapApp />
              </Wrapper>
              
            </div>
            
            
            
          </div>
          <div className="flex w-2/5">
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
