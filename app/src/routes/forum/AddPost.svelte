<script>
    import AddPost from "../../components/forum/AddPost.svelte";

    function onSuccess(postId) {
        console.log("got post id", postId);
    }
</script>

<section>
    <h1>New post</h1>
    <AddPost {onSuccess} />
</section>
