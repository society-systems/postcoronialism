<script>
    import { getPosts } from "../../store";
    import { prettyDate, toDateTime, toFullDate } from "./utils";

    let posts = getPosts(0, 1000, 0);
</script>

<style>
    ol {
        margin: 0;
        padding: 0;
    }

    a {
        text-decoration: none;
        font-weight: bold;
        color: var(--color-secondary);
    }

    li {
        list-style-type: none;
        display: flex;
        border: var(--size-xxs) solid var(--color-secondary);
        border-bottom: none;
        padding: 0 var(--size-l);
        align-items: baseline;
    }

    li.new {
        background: var(--color-tertiary);
    }

    li:last-child {
        border-bottom: var(--size-xxs) solid var(--color-secondary);
    }

    .title {
        position: relative;
        flex: 7;
    }

    .name,
    .activity {
        font-family: monospace;
        font-size: 0.9rem;
    }

    .name {
        flex: 1;
    }

    .activity {
        flex: 2;
        text-align: right;
    }
</style>

{#await posts then values}
    <ol>
        {#each values as post}
            <li class:new={!post.seen}>
                <p class="title">
                    <a href="#/forum/posts/{post.id}">{post.title}</a>
                </p>
                <p class="name">{post.name}</p>
                <p class="activity">
                    <time
                        title={toFullDate(post.lastTs * 1000)}
                        datetime={toDateTime(post.lastTs * 1000)}>
                        {prettyDate(post.lastTs * 1000)}
                    </time>
                </p>
            </li>
        {/each}
    </ol>
{:catch error}
    something bad happened
    {error}
{/await}
