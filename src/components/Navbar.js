import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'


export const Navbar = () => {
    return (
        <div className="navbar-fixed">
            <nav>
                <a href="#!" className="brand-logo"><FontAwesomeIcon icon={faBook} /></a>
                <ul className="right">
                    <li><a href="/">Library</a></li>
                    <li><a href="/create">Add Book</a></li>
                </ul>
            </nav>
        </div>

    )
}