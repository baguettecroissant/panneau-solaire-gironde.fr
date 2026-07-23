export function atPlace(name: string) {
	if (/^Le\s/u.test(name)) return `au ${name.slice(3)}`;
	if (/^Les\s/u.test(name)) return `aux ${name.slice(4)}`;
	if (/^L['’]/u.test(name)) return `à l’${name.slice(2)}`;
	return `à ${name}`;
}

export function ofPlace(name: string) {
	if (/^Le\s/u.test(name)) return `du ${name.slice(3)}`;
	if (/^Les\s/u.test(name)) return `des ${name.slice(4)}`;
	if (/^L['’]/u.test(name)) return `de l’${name.slice(2)}`;
	if (/^[AEIOUYHÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/u.test(name)) return `d’${name}`;
	return `de ${name}`;
}
