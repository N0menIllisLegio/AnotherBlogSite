import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteBlogPost, getBlogPosts} from "./services/BlogPostsService.ts";
import './assets/App.css'

function App() {
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery({ queryKey: ["BlogPosts"], queryFn: getBlogPosts });
  const { mutate } = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries();
    }
  });

  if (isPending) return (<div>Loading...</div>);
  if (error) return (<div>Error: {error.message}</div>);
  
  return (
    <div>
        {data?.map((blogPost) => (
            <div key={blogPost.id}>
                <div>{blogPost.title}</div>
                <div>{blogPost.content}</div>
            </div>
        ))}
      
      <button onClick={() => mutate("d47d2c04-51cc-4145-fa30-08dc6240552b")}>Add Post</button>
    </div>
  )
}

export default App
