
const TextWithAnchorLink = ({ text }: { text: string }) => {
    const pattern = /<1>(.*?)\[(.*?)\]<\/1>/g;
    const modifiedHTML = text.replace(pattern, '<a href="$2" class="underline font-semibold" target="_blank" rel="noreferrer">$1</a>');

    return <div dangerouslySetInnerHTML={{ __html: modifiedHTML }} />;
}

export default TextWithAnchorLink;
