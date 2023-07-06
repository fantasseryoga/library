import React, { useEffect } from 'react'
import { useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Loader } from './Loader'
import moment from "moment"


export const BooksTable = ({ books, changeStatusHandler, deleteHandler }) => {
    const [categories, setCategories] = useState([])
    const [authors, setAuthors] = useState([])
    const { request } = useHttp()

    useEffect(() => {
        try {
            request("/authors", "GET").then(data => data.json()).then(authorData => {
                setAuthors(authorData)
            })

            request("/categories", "GET").then(data => data.json()).then(catData => {
                setCategories(catData)
            })
        } catch (e) {
            alert("Sth went wrong, refreshing page may help.")
        }
    }, [request])

    return (
        <table>
            <colgroup>
                <col class="twenty" />
                <col class="ten" />
                <col class="ten" />
                <col class="ten" />
                <col class="ten" />
                <col class="ten" />
                <col class="thirty" />
            </colgroup>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>ISBN</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Created At</th>
                    <th>Last Modified</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {books.map(book => {
                    return (
                        <tr key={book.id} className={book.active ? "" : "not-active-record"}>
                            <td className='ten'>{book.title}</td>
                            <td>{book.isbn}</td>
                            <td>{authors.length ? authors.filter(el => el.id.toString() === book.author.toString())[0].name : <Loader />}</td>
                            <td>{categories.length ? categories.filter(el => el.id.toString() === book.category.toString())[0].name : <Loader />}</td>
                            <td>{moment(book.createdAt).format("d MMMM YYYY, h:mmA")}</td>
                            <td>{
                                book.modified
                                    ?
                                    moment(book.modified).format("d MMMM YYYY, h:mmA")
                                    :
                                    "--"
                            }</td>
                            <td>
                                {
                                    book.active
                                        ?
                                        <a className="waves-effect waves-light btn-small deactivate-btn" name={book.id} onClick={changeStatusHandler}>Deactivate</a>
                                        :
                                        <>
                                            <a className="waves-effect waves-light btn-small activate-btn" name={book.id} onClick={changeStatusHandler}>Re-Activate</a>
                                            <a className="waves-effect waves-light btn-small delete-btn" name={book.id} onClick={deleteHandler}>Delete</a>
                                        </>
                                }
                                <a className="waves-effect waves-light btn-small" href={"/create/" + book.id} >Edit</a>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}