import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';

interface NavbarProps {
    title: string;
    icon: string;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
    const router = useRouter();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const { data: session, status } = useSession();

    let left = (
    <div className="left">
      <Link href="/">
        <a className="bold" data-active={isActive('/')}>
          Home
        </a>
      </Link>
    </div>
  );
  let right = null;
  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Home
          </a>
        </Link>
      </div>
    );
    right = (
      <div className="right">
        <p>Carregando...</p>
      </div>
    );
  }
  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Feed
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive('/drafts')}>My drafts</a>
        </Link>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
          <button>
            <a>New post</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }   

  return (
    <>
    <nav id="nav-bar" className="fixed top-0 right-0 left-0 flex h-[64px] bg-primary-500 dark:text-white text-slate-500/90 px-1 pl-64 overflow-hidden z-20">
      <div className="w-fit flex justify-start items-center shrink">
          <div className="flex justify-start items-center shrink text-slate-500/90 w-full h-8">
              <button type="button" className="flex justify-start items-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                  <span className="sr-only px-1">Menu</span>
              </button>
              <h1 className="text-xl font-semibold tracking-tight text-slate-500/90 px-8">{props.title}</h1>
          </div>
      </div>
      <div className="w-fit flex justify-start items-center shrink">
          <button type="button">
              <span className="sr-only">Contraste</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                  </path>
              </svg>
          </button>
          <button type="button">
            <span className="sr-only">Aumentar</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
          </button>
          <button type="button">
            <span className="sr-only">Diminuir</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
              </svg>
          </button>
          <button type="button">
            <span className="sr-only">Resetar</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
          </button>
      </div>
      <div className="w-fit flex justify-end items-center grow">
          {left}
          {right}
      </div>
    </nav>
    <div id="nav-info" className="fixed top-[64px] right-0 left-0 flex h-20 bg-quaternary-500 dark:text-white text-slate-500/90 px-1 pl-64 overflow-hidden z-20">
      info
    </div>
    </>
  )
  }