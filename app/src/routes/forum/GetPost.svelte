<script>
    import Post from "../../components/forum/Post.svelte";

    export let params;
</script>

<section>
    <Post id={params.id} />
</section>
