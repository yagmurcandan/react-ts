import React, { useState } from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { QuoteType, QuotesType } from "./types/quote";
import { nanoid } from "nanoid";
import { FaRegTrashAlt } from "react-icons/fa";

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
  background-color: #90be6d;
  padding:12px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuoteDelete = styled.button`
&:hover{
  background-color: gray;
  border-radius: 12px;
}
background-color: transparent;
border: none;
cursor: pointer;
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
transition: 0.15s linear;
`

interface QuoteProps {
  quote: QuoteType;
  index: number;
  onDelete: (id:string)=> void;
}

function Quote({ quote, index, onDelete }:QuoteProps) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {provided => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.label}
       <QuoteDelete onClick={()=> {
        onDelete(quote.id);
       }}>
       <FaRegTrashAlt />
       </QuoteDelete>
        </QuoteItem>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({ quotes, handleDelete, }: {quotes: QuotesType; handleDelete:(id:string) => void}) {
  return quotes.map((quote: QuoteType, index: number) => (
    <Quote onDelete={handleDelete} quote={quote} index={index} key={quote.id} />
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

 const [quoteValue, setQuoteValue] = useState<string>("");
 
 const handleAddQuote = () => {
if(!quotes.find((quote)=> quote.label === quoteValue)) {
  const newQuote: QuoteType = {
    id: nanoid(),
    label: quoteValue,
  };
  setQuotes((prevQuotes)=> [...prevQuotes,newQuote])
}
};

const handleDeleteQuote = (id:string) => {
  const newQuotes= quotes.filter((quote) => quote.id !== id);
  setQuotes([...newQuotes]);
};


  return (
   <div>
    <h1>TO DO LIST</h1>
<form
onSubmit={(e)=>{
  e.preventDefault();
  handleAddQuote();
}}
style={{marginBottom:24}}
>
  <input value={quoteValue} onChange={(e) => {
    setQuoteValue(e.target.value);
  }}/>
  <button>Add</button>
</form>
<DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList handleDelete = {handleDeleteQuote} quotes={quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
   </div>
  );
}
export default App;