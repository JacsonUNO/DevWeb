import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Post = () => {
    const { postId } = useParams();
    const [post, setListaPosts] = useState([]);
    const [replies, setListaReplies] = useState([]);
    const [reply, setReply] = useState('');
    React.useEffect(() => {
        const res = axios.get("blog/api/v1/rest/post/" + postId);
        res.then((query) => {
            setListaPosts(query.data);
            console.log(query.data);
        })
        const res2 = axios.get("blog/api/v1/rest/postreply/" + postId);
        res2.then((query) => {
            setListaReplies(query.data);
            console.log(query.data);
        })
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (reply.length < 1) {
                alert('Não é possível criar um comentário vazio.');
            } else {
                const response = await axios.post('blog/api/v1/rest/reply', {
                    id_post: postId,
                    reply,
                });

                setReply('');
                window.location.reload();
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            {post && (
                <div className='row'>
                    <h1>{post.title}</h1>
                    <h2>{post.post}</h2>
                    <h5>Post #{post.id}, created {post.createdAt},
                        updated {post.updatedAt}</h5>
                    <div className='row'>
                        {replies.length > 0 && (<table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Resposta</th>
                                    <th>Criado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {replies &&
                                    replies.map((reply, index) => (
                                        <tr key={index}>
                                            <th key={reply.id}>{reply.id}</th>
                                            <th key={reply.reply}>{reply.reply}</th>
                                            <th key={reply.createdAt}>{reply.createdAt}</th>
                                        </tr>
                                    ))
                                }
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
                                <button type='submit' style={{marginLeft: 93 }}>Criar comentário</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )

}

export default Post;