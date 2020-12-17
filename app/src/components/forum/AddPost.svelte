<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import { addPost } from "../../store";
    import Markdown from "../Markdown.svelte";

    export let onSuccess;
    export let replyTo = "0";

    const draftKey = `post-draft:${replyTo}`;

    let { title, body } = loadDraft();
    let error;
    let showPreview;
    let timerId;

    function saveDraft() {
        localStorage.setItem(draftKey, JSON.stringify({ title, body }));
    }

    function loadDraft() {
        let values;
        try {
            values = JSON.parse(localStorage.getItem(draftKey));
        } catch (e) {
            console.log(e);
        }
        values = values || {};
        return {
            title: values.title || "",
            body: values.body || "",
        };
    }

    function clearDraft() {
        localStorage.removeItem(draftKey);
    }

    onMount(() => {
        timerId = setInterval(saveDraft, 1000);
        return () => clearInterval(timerId);
    });

    function togglePreview() {
        showPreview = !showPreview;
    }

    async function handleSubmit() {
        try {
            const postId = await addPost(replyTo, title, body);
            title = "";
            body = "";
            clearInterval(timerId);
            clearDraft();
            if (onSuccess) {
                onSuccess(postId);
            } else {
                push("#/forum");
            }
        } catch (e) {
            error = e.message;
        }
    }
</script>

<style>
    form {
        display: flex;
        flex-direction: column;
    }

    input[type="text"] {
        margin-bottom: var(--size-l);
    }

    input[type="text"],
    textarea {
        width: 100%;
    }

    textarea {
        min-height: 10rem;
    }

    p,
    label {
        font-size: 0.9rem;
    }

    input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
    }

    .commands {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
</style>

<form on:submit|preventDefault={handleSubmit} autocomplete="off">
    {#if replyTo === '0'}
        <input
            type="text"
            placeholder="Type a title"
            required
            bind:value={title} />
    {/if}
    <textarea placeholder="Type a message" required bind:value={body} />
    {#if showPreview}
        <div class="preview">
            {#if body.length === 0}
                <p>Nothing to preview. Type something in the field above.</p>
            {/if}
            <Markdown text={body} />
        </div>
    {/if}
    <div class="commands">
        <p>
            Use
            <a
                href="https://guides.github.com/features/mastering-markdown/#syntax"
                target="_blank">
                markdown</a>
            to format the message.
            <label>Show preview
                <input type="checkbox" bind:checked={showPreview} /></label>
        </p>
        <button type="submit">Post</button>
    </div>
    {#if error}{error}{/if}
</form>
