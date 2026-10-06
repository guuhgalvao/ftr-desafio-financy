import { LogOut, Mail, Plus, SquarePen, Trash, UserRound, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { CategoryIcon } from '@/components/category-icon'
import { IconButton } from '@/components/icon-button'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { PaginationButton } from '@/components/pagination-button'
import { Select } from '@/components/select'
import { Tag } from '@/components/tag'
import { TypeBadge } from '@/components/type-badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CATEGORY_COLORS, CATEGORY_ICON_NAMES } from '@/lib/categories'
import { formatDate, toISODate } from '@/lib/format'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-gray-800 text-xl">{title}</h2>
      <div className="flex flex-col gap-6 rounded-xl border border-purple-base border-dashed bg-white p-8">
        {children}
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_10rem]">
      <div className="flex flex-wrap items-center justify-center gap-4">{children}</div>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  )
}

const OPTIONS = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
]

export default function StyleguidePage() {
  const [selected, setSelected] = useState('1')
  const [empty, setEmpty] = useState('')
  const [date, setDate] = useState<Date | undefined>()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12">
      <header className="flex flex-col gap-4">
        <Logo />
        <h1 className="font-bold text-2xl text-gray-800">Componentes</h1>
      </header>

      <Section title="Input">
        <Row label="Empty">
          <div className="w-full max-w-xs">
            <Input label="Label" icon={Mail} placeholder="Placeholder" helper="Helper" />
          </div>
        </Row>
        <Row label="Active">
          <div className="w-full max-w-xs">
            <Input
              label="Label"
              icon={Mail}
              defaultValue="Text"
              helper="Helper"
              data-force="active"
            />
          </div>
        </Row>
        <Row label="Filled">
          <div className="w-full max-w-xs">
            <Input label="Label" icon={Mail} defaultValue="Text" helper="Helper" />
          </div>
        </Row>
        <Row label="Error">
          <div className="w-full max-w-xs">
            <Input label="Label" icon={Mail} defaultValue="Text" error="Mensagem de erro" />
          </div>
        </Row>
        <Row label="Empty / active, error">
          <div className="grid w-full max-w-xs grid-cols-2 gap-4">
            <Input label="Label" icon={Mail} placeholder="Placeholder" data-force="active" />
            <Input label="Label" icon={Mail} placeholder="Placeholder" error="Obrigatório" />
          </div>
        </Row>
        <Row label="Disabled">
          <div className="w-full max-w-xs">
            <Input label="Label" icon={Mail} defaultValue="Text" helper="Helper" disabled />
          </div>
        </Row>
        <Row label="Prefix / right slot">
          <div className="grid w-full max-w-xs grid-cols-2 gap-4">
            <Input label="Valor" prefix="R$" placeholder="0,00" />
            <Input
              label="Senha"
              type="password"
              placeholder="Senha"
              rightSlot={<X className="size-4 text-gray-700" />}
            />
          </div>
        </Row>
        <Row label="Select">
          <div className="w-full max-w-xs">
            <Select
              label="Label"
              icon={Mail}
              options={OPTIONS}
              value={selected}
              onValueChange={setSelected}
            />
          </div>
        </Row>
        <Row label="Select / placeholder">
          <div className="w-full max-w-xs">
            <Select
              label="Label"
              options={OPTIONS}
              value={empty}
              onValueChange={setEmpty}
              placeholder="Selecione"
            />
          </div>
        </Row>
        <Row label="Select / error, empty">
          <div className="grid w-full max-w-xs grid-cols-2 gap-4">
            <Select label="Label" options={OPTIONS} placeholder="Selecione" error="Obrigatório" />
            <Select
              label="Label"
              options={[]}
              placeholder="Selecione"
              emptyContent={<p className="text-gray-500 text-sm">Nenhuma opção</p>}
            />
          </div>
        </Row>
        <Row label="Select / disabled">
          <div className="w-full max-w-xs">
            <Select label="Label" options={OPTIONS} value="1" disabled />
          </div>
        </Row>
      </Section>

      <Section title="Label Button">
        {(['md', 'sm'] as const).map((size) => (
          <div key={size} className="flex flex-col gap-6">
            <Row label={`${size === 'md' ? 'Md' : 'Sm'} / Default`}>
              <Button size={size} icon={UserRound}>
                Label
              </Button>
              <Button size={size} variant="outline" icon={UserRound}>
                Label
              </Button>
              <Button size={size} variant="danger">
                Excluir
              </Button>
            </Row>
            <Row label={`${size === 'md' ? 'Md' : 'Sm'} / Hover`}>
              <Button size={size} icon={UserRound} data-force="hover">
                Label
              </Button>
              <Button size={size} variant="outline" icon={UserRound} data-force="hover">
                Label
              </Button>
              <Button size={size} variant="danger" data-force="hover">
                Excluir
              </Button>
            </Row>
            <Row label={`${size === 'md' ? 'Md' : 'Sm'} / Disabled`}>
              <Button size={size} icon={UserRound} disabled>
                Label
              </Button>
              <Button size={size} variant="outline" icon={UserRound} disabled>
                Label
              </Button>
              <Button size={size} variant="danger" disabled>
                Excluir
              </Button>
            </Row>
          </div>
        ))}
        <Row label="Full width / ícone danger">
          <div className="flex w-full max-w-xs flex-col gap-4">
            <Button fullWidth>Entrar</Button>
            <Button fullWidth variant="outline" icon={LogOut} iconClassName="text-danger">
              Sair da conta
            </Button>
          </div>
        </Row>
      </Section>

      <Section title="Icon Button">
        <Row label="Default">
          <IconButton icon={SquarePen} aria-label="Editar" />
          <IconButton icon={Trash} variant="danger" aria-label="Excluir" />
        </Row>
        <Row label="Hover">
          <IconButton icon={SquarePen} aria-label="Editar" data-force="hover" />
          <IconButton icon={Trash} variant="danger" aria-label="Excluir" data-force="hover" />
        </Row>
        <Row label="Disabled">
          <IconButton icon={SquarePen} aria-label="Editar" disabled />
          <IconButton icon={Trash} variant="danger" aria-label="Excluir" disabled />
        </Row>
      </Section>

      <Section title="Link">
        <Row label="Default">
          <Link>Label</Link>
          <Link icon={Plus}>Nova transação</Link>
        </Row>
        <Row label="Hover">
          <Link data-force="hover">Label</Link>
        </Row>
      </Section>

      <Section title="Pagination Button">
        <Row label="Default">
          <PaginationButton>1</PaginationButton>
        </Row>
        <Row label="Hover">
          <PaginationButton data-force="hover">1</PaginationButton>
        </Row>
        <Row label="Active">
          <PaginationButton active>1</PaginationButton>
        </Row>
        <Row label="Disabled">
          <PaginationButton disabled>1</PaginationButton>
        </Row>
      </Section>

      <Section title="Tag">
        <Row label="Cores">
          <Tag color="gray">Label</Tag>
          {CATEGORY_COLORS.map((color) => (
            <Tag key={color} color={color}>
              Label
            </Tag>
          ))}
        </Row>
      </Section>

      <Section title="Type">
        <Row label="Entrada">
          <TypeBadge type="INCOME" />
        </Row>
        <Row label="Saída">
          <TypeBadge type="EXPENSE" />
        </Row>
      </Section>

      <Section title="Category Icon">
        <Row label="16 ícones">
          {CATEGORY_ICON_NAMES.map((icon, index) => (
            <CategoryIcon
              key={icon}
              icon={icon}
              color={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
            />
          ))}
        </Row>
        <Row label="Sem categoria">
          <CategoryIcon />
          <Tag>Sem categoria</Tag>
        </Row>
      </Section>

      <Section title="Avatar">
        <Row label="sm / lg">
          <Avatar name="Conta teste" />
          <Avatar name="Conta teste" size="lg" />
          <Avatar name="Ana" />
        </Row>
        <Row label="Com foto / foto que não carrega">
          <Avatar name="Conta teste" src="/favicon.svg" />
          <Avatar name="Conta teste" src="/favicon.svg" size="lg" />
          <Avatar name="Conta teste" src="/nao-existe.png" />
        </Row>
      </Section>

      <Section title="Checkbox">
        <Row label="Desmarcado / marcado / disabled">
          <Checkbox aria-label="Desmarcado" />
          <Checkbox aria-label="Marcado" defaultChecked />
          <Checkbox aria-label="Desabilitado" disabled />
        </Row>
      </Section>

      <Section title="Toast">
        <Row label="sonner">
          <Button size="sm" variant="outline" onClick={() => toast.success('Categoria criada')}>
            Sucesso
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.error('Já existe uma categoria com esse nome')}
          >
            Erro
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info('Recuperação de senha ainda não disponível')}
          >
            Informativo
          </Button>
        </Row>
      </Section>

      <Section title="Dialog / AlertDialog / Calendar">
        <Row label="Dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Abrir modal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex flex-col gap-0.5">
                  <DialogTitle>Nova transação</DialogTitle>
                  <DialogDescription>Registre sua despesa ou receita</DialogDescription>
                </div>
                <DialogClose asChild>
                  <IconButton icon={X} aria-label="Fechar" />
                </DialogClose>
              </DialogHeader>
              <Input label="Descrição" placeholder="Ex. Almoço no restaurante" />
              <Button fullWidth>Salvar</Button>
            </DialogContent>
          </Dialog>
        </Row>
        <Row label="AlertDialog">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                Excluir categoria
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
                <AlertDialogDescription>
                  As 12 transações desta categoria ficarão sem categoria.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button size="sm" variant="outline">
                    Cancelar
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button size="sm" variant="danger">
                    Excluir
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
        <Row label="Popover + Calendar">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                {date ? formatDate(toISODate(date)) : 'Selecione'}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </Row>
      </Section>
    </main>
  )
}
