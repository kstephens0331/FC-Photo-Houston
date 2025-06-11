import React from 'react'
import { motion } from 'framer-motion'

import img1 from '../assets/scrapbook_1.png'
import img2 from '../assets/scrapbook_2.png'
import img3 from '../assets/scrapbook_3.png'
import img4 from '../assets/scrapbook_4.png'
import img5 from '../assets/scrapbook_5.png'
import img6 from '../assets/scrapbook_6.png'
import img7 from '../assets/scrapbook_7.png'
import img8 from '../assets/scrapbook_8.png'
import img9 from '../assets/scrapbook_9.png'
import img10 from '../assets/scrapbook_10.png'
import img11 from '../assets/scrapbook_11.png'

const images = [
  { src: img1, style: 'top-0 left-0 w-48 rotate-[-2deg]' },
  { src: img2, style: 'top-60 right-40 w-44 rotate-[2deg]' },
  { src: img3, style: 'top-[140px] left-12 w-52 rotate-[1deg]' },
  { src: img4, style: 'top-[275px] right-[325px] w-44 rotate-[-1deg]' },
  { src: img5, style: 'top-[40px] left-[35%] w-48 rotate-[2deg]' },
  { src: img6, style: 'top-[280px] left-0 w-52 rotate-[-3deg]' },
  { src: img7, style: 'top-[280px] right-0 w-52 rotate-[1deg]' },
  { src: img8, style: 'top-[500px] left-[30%] w-48 rotate-[-2deg]' },
  { src: img9, style: 'top-[460px] left-7 w-48 rotate-[1deg]' },
  { src: img10, style: 'top-[400px] right-[20%] w-48 rotate-[2deg]' },
  { src: img11, style: 'top-[5px] right-12 w-52 rotate-[-1deg]' },
]

const ImageCollage = () => {
  return (
    <div className="relative h-[700px] w-full md:w-[90%] mx-auto scale-[0.95] md:scale-100">
      {images.map((img, idx) => (
        <motion.img
          key={idx}
          src={img.src}
          alt={`Scrapbook ${idx + 1}`}
          className={`absolute rounded-lg shadow-xl border-4 border-white object-cover ${img.style}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: idx * 0.1,
            ease: 'easeOut'
          }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  )
}

export default ImageCollage
