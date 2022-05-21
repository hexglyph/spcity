import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';

interface UserProps {
    title: string;
    icon: string;
}

export default function User<UserProps>(props){
    

  return (
    <>
    <div id="user" className="fixed top-0 bottom-0 left-0 h-24 w-24 flex bg-primary-500 z-[45]">
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[50]">
          <div className="h-full w-full">
            User
          </div>
        </div>
        <div className="fixed top-[32px] bottom-0 left-0 h-56 w-56
        bg-gradient-to-t from-tertiary-500 to-secondary-500 rotate-45 rounded p-2">
          <div className="h-full w-full
        bg-gradient-to-t from-primary-500 to-primary-500 rounded">
          </div>
        </div>
    </div>
    </>
  )
  }