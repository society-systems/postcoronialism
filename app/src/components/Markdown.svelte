<script>
  import DOMPurify from "dompurify";
  import marked from "marked";

  export let text;
</script>

{#if text && text.length}
  {@html DOMPurify.sanitize(marked(text))}
{/if}
