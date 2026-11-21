export default function classnames(...classes: (string | boolean | null | undefined)[]) {
	return classes.filter((c) => !!c).join(' ');
}
