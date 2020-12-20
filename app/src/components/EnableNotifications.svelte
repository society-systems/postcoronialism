<script>
    import { subscribeToNotifications, notifications } from "../store";
</script>

{#if !$notifications}
    <section>
        <button on:click={subscribeToNotifications}>
            Enable web notifications
        </button>
    </section>
{/if}
