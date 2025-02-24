import React from 'react'
import Header from './Header'
export default function Footer() {
  return (
    <footer className=" text-white py-4 mt-8 text-center">
  <p>&copy; {new Date().getFullYear()} Franco Pinedo - EDI3</p>
</footer>
  )
}
