<script>
    import { prettyDate, toDateTime, toFullDate } from "./utils";
    import AddPost from "./AddPost.svelte";
    import Markdown from "../Markdown.svelte";
    import { getPost, getPosts } from "../../store";
    export let id;

    let postPromise = getPost(id);
    let repliesPromise = getPosts(id, 10, 0);

    function onReply(replyId) {
        repliesPromise = getPosts(id, 10, 0);
    }
</script>

<style>
    h1 {
        font-size: 2.5rem;
        color: var(--color-secondary);
        padding: var(--size-m);
    }
    ol {
        margin: 0;
        padding: 0;
    }
    li {
        list-style-type: none;
        margin-bottom: var(--size-l);
    }
    .post {
        margin-bottom: var(--size-l);
    }
    .metadata {
        font-family: monospace;
        padding: var(--size-s) var(--size-m);
        font-size: 0.9rem;
        margin: 0;
        color: var(--color-secondary);
        border-bottom: var(--size-xxs) solid var(--color-primary);
    }
    .metadata,
    .body {
        background: #00000033;
    }
    .body {
        padding: var(--size-m);
    }
    .replies {
        margin-bottom: var(--size-xxl);
    }
</style>

{#await postPromise then post}
    <div class="post">
        <h1>{post.title}</h1>
        <p class="metadata">
            <strong>{post.name}</strong>
            commented
            <time
                title={toFullDate(post.ts * 1000)}
                datetime={toDateTime(post.ts * 1000)}>
                {prettyDate(post.ts * 1000)}
            </time>
        </p>
        <div class="body">
            <Markdown text={post.body} />
        </div>
    </div>
    <div class="replies">
        {#await repliesPromise then replies}
            <ol>
                {#each replies as reply}
                    <li>
                        <p class="metadata">
                            <strong>{reply.name}</strong>
                            commented
                            <time
                                title={toFullDate(reply.ts * 1000)}
                                datetime={toDateTime(reply.ts * 1000)}>
                                {prettyDate(reply.ts * 1000)}
                            </time>
                        </p>
                        <div class="body">
                            <Markdown text={reply.body} />
                        </div>
                    </li>
                {/each}
            </ol>
        {:catch error}
            {error.message}
        {/await}
    </div>

    <p class="metadata">Your reply</p>
    <AddPost replyTo={id} onSuccess={onReply} />
{:catch error}
    {error.message}
{/await}
