'use client'
import {  useState } from 'react'
import ShowCase from "@/components/Showcase"
import SecondSec from '@/components/secondsec'
import ContactForm from '@/components/ContactForm'

export default function Home() {
 

  return (
    <>
   <ShowCase />
    <SecondSec/>
    <ContactForm/>
    </>
  )
}
