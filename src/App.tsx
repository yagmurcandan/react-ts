import React, { useState } from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { QuoteType, QuotesType } from "./types/quote";


const reorder = (list:QuotesType, startIndex:number, endIndex:number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: 24px;
  background-color: lightblue;
  padding:12px;
`;

interface QuoteProps {
  quote: QuoteType;
  index: number;
}

function Quote({ quote, index }:QuoteProps) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {provided => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.label}
        </QuoteItem>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({ quotes }: {quotes: QuotesType}) {
  return quotes.map((quote: QuoteType, index: number) => (
    <Quote quote={quote} index={index} key={quote.id} />
  ));
});

function App() {
  const [quotes, setQuotes] = useState<QuoteType[]>([]);

  function onDragEnd(result:DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newQuotes = reorder(
      quotes,
      result.source.index,
      result.destination.index
    );

    setQuotes( newQuotes );
  }

  

  return (
   <div>
<form
onSubmit={(e)=>{
  e.preventDefault();
}}>
  <input/>
  <button>Add</button>
</form>
<DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList quotes={quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
   </div>
  );
}
export default App;