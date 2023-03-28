interface IWebRowProps {
    label?: string | null;
    href?: string | null;
}

const DetailWebRow = ({ label, href }: IWebRowProps): JSX.Element => {
    if (!label || !href) return <></>
    return <a href={href} className="font-semibold underline" target="_blank" rel="noreferrer">{label}</a>
};

export default DetailWebRow;
