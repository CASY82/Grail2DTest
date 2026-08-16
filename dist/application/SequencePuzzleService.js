export class SequencePuzzleService {
    answer;
    index = 0;
    constructor(answer) {
        this.answer = answer;
    }
    click(value) {
        if (value === this.answer[this.index])
            this.index++;
        else
            this.index = 0;
        const solved = this.index === this.answer.length;
        return { solved, progress: this.index, reset: !solved && this.index === 0 };
    }
}
