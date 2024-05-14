import React, { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    // const apiUrl = "http://localhost:8000";
    const apiUrl = "https://todo-backen-o6d2.onrender.com";

    const handleSubmit = () => {
        setError("");
        // check inputs
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })
                .then((res) => {
                    if (res.ok) {
                        // add item to list
                        console.log("TODO", { title, description });
                        // setTodos([...todos, { title, description }]);
                        getItems();
                        setTitle("");
                        setDescription("");
                        setMessage("Item added successfully");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                    } else {
                        // Set Error
                        setError("Unable to create todo item");
                    }
                })
                .catch(() => {
                    setError("Unable to create todo item");
                });
        }
    };

    useEffect(() => {
        setLoading(true);
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log("ALL TODOS", res);
                setTodos(res);
                setLoading(false);
            }).catch(() => {
                setError("Unable to fetch todo items");
                setLoading(false); // Set loading to false in case of error
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        // check inputs
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        // update item to list
                        // console.log("TODO", { editTitle, editDescription });

                        const updatedTodos = todos.map((item) => {
                            if (item._id === editId) {
                                item.title = editTitle;
                                item.description = editDescription;
                            }
                            return item;
                        });

                        setTodos(updatedTodos);
                        setMessage("Item updated successfully");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                        setEditId(-1);
                    } else {
                        // Set Error
                        setError("Unable to update todo item");
                    }
                })
                .catch(() => {
                    setError("Unable to update todo item // catch");
                });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure want to delete?")) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE",
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };
    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>Todo Project with MERN Stack</h1>
            </div>
            <div className="row p-3">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                    />
                    <input
                        placeholder="description"
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row p-3 mt-3">
            {loading && <p>Loading...</p>}
                <h3>Tasks</h3>
                <div className="col-md-6">
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li
                                key={item._id}
                                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
                            >
                                <div className="d-flex flex-column me-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold">
                                                {item.title}
                                            </span>
                                            <span>{item.description}</span>
                                        </>
                                    ) : (
                                        <div className="form-group d-flex gap-2">
                                            <input
                                                placeholder="title"
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                                className="form-control"
                                            />
                                            <input
                                                placeholder="description"
                                                type="text"
                                                onChange={(e) =>
                                                    setEditDescription(
                                                        e.target.value
                                                    )
                                                }
                                                value={editDescription}
                                                className="form-control"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-warning"
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </button>
                                    )}
                                    {editId === -1 ? (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDelete(item._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleEditCancel}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
