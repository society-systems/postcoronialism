<script>
    import AddPost from "../../components/forum/AddPost.svelte";
    import { push } from "svelte-spa-router";

    function onSuccess(postId) {
        push("/forum/posts/" + postId);
    }
</script>

<section>
    <h1>New post</h1>
    <AddPost {onSuccess} />
</section>
