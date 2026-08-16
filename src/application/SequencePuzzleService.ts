export interface SequenceFeedback { solved:boolean; progress:number; reset:boolean; }
export class SequencePuzzleService<T> {
  private index=0;
  constructor(private readonly answer:readonly T[]){}
  click(value:T):SequenceFeedback{
    if(value===this.answer[this.index]) this.index++; else this.index=0;
    const solved=this.index===this.answer.length;
    return {solved,progress:this.index,reset:!solved&&this.index===0};
  }
}
