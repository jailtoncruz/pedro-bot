import { KazagumoPlayer } from "kazagumo";

export function getTimeRemaining(player: KazagumoPlayer): String {
	const hh = Math.floor(player.queue.durationLength / 1000 / 60 / 60);
	const _h = hh * 60 * 60 * 1000;
	const mm = Math.floor((player.queue.durationLength - _h) / 1000 / 60);

	return hh > 0
		? `${hh} horas e ${mm} minutos de reprodução`
		: `${mm} minutos de reprodução`;
}
