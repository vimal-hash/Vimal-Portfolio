'use client'
import ShowCase from "@/components/Showcase"
import SecondSec from '@/components/secondsec'
import ContactForm from '@/components/ContactForm'
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
 

  return (
    <>
   <ShowCase />
    <SecondSec/>
    <ContactForm/>
    <SpeedInsights/>
    </>
  )
}
