<script lang="ts">
	import MarkdownIt from 'markdown-it';
	import policy from './policy.md?raw';
</script>

<article class="prose mx-auto">
	{@html new MarkdownIt({ html: true }).render(policy)}
</article>
