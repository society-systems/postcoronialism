<script>
    import Post from "../../components/forum/Post.svelte";

    export let params;
    console.log(params);
</script>

<section>
    <Post id={params.id} />
</section>
