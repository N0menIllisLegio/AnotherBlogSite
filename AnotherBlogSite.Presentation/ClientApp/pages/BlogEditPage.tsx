import {useNavigate, useParams} from "react-router";
import {useEffect} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateBlogPost, UpdateBlogPost} from "../services/BlogPostsService.ts";
import IBlogPost from "../models/IBlogPost.ts";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/BlogEditPage.css";
import {useBlogPostsService} from "../hooks/useDependencyInjection.ts";
import RequestError from "../models/RequestError.ts";
import Input from "../components/Input.tsx";
import TextArea from "../components/TextArea.tsx";
import Error from "../components/Error.tsx";
import { useForm, SubmitHandler } from "react-hook-form";

interface IBlogPostForm {
    title: string;
    content: string;
}

export default function BlogEditPage() {
    const { blogPostId } = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IBlogPostForm>();

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const blogPostsService = useBlogPostsService();
    const blogPost = useQuery({
        queryKey: [QueryKey.BlogPosts, blogPostId],
        queryFn: () => blogPostsService.getBlogPost(blogPostId!),
        enabled: !!blogPostId,
    });

    const createMutation = useMutation<IBlogPost, RequestError, CreateBlogPost>({ mutationFn: blogPostsService.createBlogPost, onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId], data);
            queryClient.setQueryData([QueryKey.BlogPosts], (oldData: IBlogPost[] | undefined) => oldData
                ? [...oldData, data]
                : undefined);

            navigate(`/blogPosts/${data.id}`, { replace: true });
        }
    });

    const updateMutation = useMutation<IBlogPost, RequestError, UpdateBlogPost>({ mutationFn: blogPostsService.updateBlogPost, onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId], data);
            queryClient.setQueryData([QueryKey.BlogPosts],
                (oldData: IBlogPost[] | undefined) => oldData
                    ? [...oldData.filter(x => x.id !== blogPostId), data]
                    : undefined);

            navigate(-1);
        }
    });

    const onEdit: SubmitHandler<IBlogPostForm> = async (data) => {
        if (!!blogPostId) {
            updateMutation.mutate({ blogPostId, title: data.title, content: data.content });
        } else {
            createMutation.mutate({ title: data.title, content: data.content });
        }
    }

    useEffect(() => {
        if (!blogPost.isPending && !blogPost.isError) {
            reset({
                title: blogPost.data.title,
                content: blogPost.data.content
            })
        }
    }, [blogPost.data?.id]);

    return <form onSubmit={handleSubmit(onEdit)} className="blogEditContent">
        <Input type="text" label="Blog Title:" error={errors.title?.message?.toString()}
               {...register("title", {
                   required: "Please enter Blog's title",
                   minLength: {
                       value: 10,
                       message: "Min title length is 10",
                   },
               })} />

        <br/>

        <TextArea cols={100} rows={30} label="Blog Content:" error={errors.content?.message?.toString()}
                  {...register("content", {
                      required: "Please enter Blog's content",
                      minLength: {
                          value: 500,
                          message: "Min title length is 500",
                      },
                  })}/>

        <div>
            { isSubmitting && <div>{!!blogPostId ? "Editing" : "Adding"} Post</div> }
            {!isSubmitting && <button className="actionButton" type="submit">{!!blogPostId ? "Edit" : "Add"} Post</button> }
            {updateMutation.isError && <Error error={updateMutation.error.message}/>}
            {createMutation.isError && <Error error={createMutation.error.message} />}
        </div>
    </form>
}