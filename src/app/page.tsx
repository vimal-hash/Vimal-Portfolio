'use client'
import ShowCase from "@/components/Showcase"
// import TestCase from "@/components/Testcase"

import ShowNew from "@/components/Shownew"
import SecondSec from '@/components/secondsec'
import ContactForm from '@/components/ContactForm'
import ProjectCards from '@/components/ProjectCards'
import AboutMe from '@/components/Aboutme'
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
 

  return (
    <>
   <ShowCase />
   {/* <TestCase/> */}
   {/* <ShowNew/> */}
    {/* <SecondSec/> */}
    <ProjectCards/>
    <AboutMe/>
     <div id="contact">
    {/* <ContactForm/> */}
    </div>
    <SpeedInsights/>
    </>
  )
}
