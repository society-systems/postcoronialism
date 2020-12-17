<script>
    import { prettyDate, toDateTime, toFullDate } from "./utils";
    import AddPost from "./AddPost.svelte";
    import Markdown from "../Markdown.svelte";
    import { getPost, getPosts, markPostAsSeen, publicKey } from "../../store";
    export let id;

    let postPromise = getPost(id);
    let repliesPromise = getPosts(id, 1000, 0);

    setTimeout(() => {
        markPostAsSeen(id);
    }, 1000);

    function onReply(replyId) {
        repliesPromise = getPosts(id, 1000, 0);
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
        color: var(--color-secondary);
        border-bottom: var(--size-xxs) solid var(--color-primary);
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
    .metadata.new {
        color: var(--color-tertiary);
    }
    .metadata p,
    .metadata .controls {
        font-family: monospace;
        font-size: 0.9rem;
        padding: var(--size-s) var(--size-m);
        margin: 0;
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
        <div class="metadata">
            <p>
                <strong>{post.name}</strong>
                commented
                <time
                    title={toFullDate(post.ts * 1000)}
                    datetime={toDateTime(post.ts * 1000)}>
                    {prettyDate(post.ts * 1000)}
                </time>
            </p>
            {#if post.publicKey === $publicKey}
                <div class="controls"><a>Edit</a> <a>Delete</a></div>
            {/if}
        </div>
        <div class="body">
            <Markdown text={post.body} />
        </div>
    </div>
    <div class="replies">
        {#await repliesPromise then replies}
            <ol>
                {#each replies.reverse() as reply}
                    <li>
                        <div
                            class="metadata"
                            class:new={reply.ts > post.seenTs}>
                            <p>
                                <strong>{reply.name}</strong>
                                commented
                                <time
                                    title={toFullDate(reply.ts * 1000)}
                                    datetime={toDateTime(reply.ts * 1000)}>
                                    {prettyDate(reply.ts * 1000)}
                                </time>
                            </p>
                            {#if reply.publicKey === $publicKey}
                                <div class="controls">
                                    <a>Edit</a>
                                    <a>Delete</a>
                                </div>
                            {/if}
                        </div>
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

    <div class="metadata">
        <p>Your reply</p>
    </div>
    <AddPost replyTo={id} onSuccess={onReply} />
{:catch error}
    {error.message}
{/await}
