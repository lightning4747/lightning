import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Book {
  title: string;
  author: string;
  genre: string;
  color: string;
  year?: string;
}

const books: Book[] = [
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology · Cognition', color: '#E8645A', year: '2011' },
  { title: 'Kafka on the Shore', author: 'Haruki Murakami', genre: 'Magical Realism · Fiction', color: '#5B9CF6', year: '2002' },
  { title: 'The Molecule of More', author: 'Daniel Z. Lieberman', genre: 'Neuroscience · Behavior', color: '#c084fc', year: '2018' },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Classic · Psychological Fiction', color: '#F5C842', year: '1866' },
  { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', color: '#5DBE89', year: '2008' },
  { title: 'System Design Interview', author: 'Alex Xu', genre: 'Engineering · Architecture', color: '#38bdf8', year: '2020' },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', genre: 'Software Craft', color: '#f472b6', year: '1999' },
];

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
};

export const BooksPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* Back nav */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-8 left-8 z-50 font-mono text-xs tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        Back
      </motion.button>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-accent-primary mb-3">Easter Egg · /books</p>
          <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.9] tracking-tighter">
            What I<br />
            <span className="text-text-secondary opacity-30">Read</span>
          </h1>
          <p className="mt-6 text-text-secondary font-sans text-base max-w-md leading-relaxed">
            A curated shelf. Some rewired how I think. Some broke me open. All left marks.
          </p>
        </motion.div>

        {/* Book list */}
        <motion.div
          variants={CONTAINER}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-0"
        >
          {books.map((book, idx) => (
            <motion.div
              key={book.title}
              variants={ITEM}
              className="group relative flex items-center gap-6 py-6 border-b border-border last:border-none"
            >
              {/* Number */}
              <span
                className="font-display text-4xl font-black w-12 text-right shrink-0 transition-colors duration-300"
                style={{ color: `${book.color}30` }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Spine color bar */}
              <motion.div
                className="w-1 h-10 rounded-full shrink-0 transition-all duration-500"
                style={{ backgroundColor: book.color }}
                whileHover={{ scaleY: 1.4 }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-display text-base md:text-lg uppercase tracking-wider font-bold text-text-primary group-hover:text-text-primary transition-colors duration-300 truncate"
                >
                  {book.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[11px] text-text-muted tracking-widest">{book.author}</span>
                  <span className="text-text-muted opacity-40">·</span>
                  <span
                    className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${book.color}18`, color: book.color }}
                  >
                    {book.genre}
                  </span>
                </div>
              </div>

              {/* Year */}
              {book.year && (
                <span className="font-mono text-[11px] text-text-muted/40 shrink-0">{book.year}</span>
              )}

              {/* Hover line */}
              <motion.div
                className="absolute bottom-0 left-0 h-[1px] origin-left"
                style={{ backgroundColor: book.color }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 font-mono text-[11px] italic text-text-muted tracking-widest text-center"
        >
          "A reader lives a thousand lives before he dies." 
        </motion.p>
      </div>
    </div>
  );
};
