import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Post = () => {
    const { postId } = useParams();
    const [post, setPost] = useState([]);
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`blog/api/v1/rest/post/${postId}`);
            setPost(res.data);

            const res2 = await axios.get(`blog/api/v1/rest/postreply/${postId}`);
            setReplies(res2.data);
        };

        fetchData();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (reply.length < 1) {
                alert('Não é possível criar um comentário vazio.');
            } else {
                await axios.post('blog/api/v1/rest/reply', {
                    id_post: postId,
                    reply,
                });

                setReply('');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await axios.delete(`blog/api/v1/rest/reply/${replyId}`);
            const updatedReplies = replies.filter(reply => reply.id !== replyId);
            setReplies(updatedReplies);
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    return (
        <div>
            {post && (
                <div className='row'>
                    <h1>{post.title}</h1>
                    <h2>{post.post}</h2>
                    <h5>Post #{post.id}, created {post.createdAt},
                        updated {post.updatedAt}</h5>
                    <div className='row'>
                        {replies.length > 0 && (
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Resposta</th>
                                        <th>Criado</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {replies.map((reply) => (
                                        <tr key={reply.id}>
                                            <td>{reply.id}</td>
                                            <td>{reply.reply}</td>
                                            <td>{reply.createdAt}</td>
                                            <td>
                                                <button onClick={() => handleDeleteReply(reply.id)}>
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="reply">Comentário:  </label>
                                <input type='text' id='reply'
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                            </div>
                            <div>
                                <button type='submit' style={{ marginLeft: 93 }}>Criar comentário</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
